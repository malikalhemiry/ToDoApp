import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  signal,
  Renderer2
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'ebs-tree',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TreeModule,
    ContextMenu,
    InputText,
    Checkbox
  ],
  templateUrl: './ebs-tree-component.html',
  styleUrl: './ebs-tree-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EbsTreeComponent {
  @ViewChild('ctxMenu') ctxMenuRef?: ElementRef<HTMLDivElement>;

  @Input() nodes: any[] = [];
  @Input() showCheckbox = false;
  @Input() showFilter = false;
  @Input() filterPlaceholder = 'بحث...';
  @Input() label = 'شجرة الحسابات';
  @Input() menuItems: { action: string; label: string; icon: string; disabled?: boolean }[] = [];
  @Input() loading = false;

  @Output() nodeClick = new EventEmitter<any>();
  @Output() nodeCheck = new EventEmitter<{ node: any; checked: boolean }>();
  @Output() nodeExpand = new EventEmitter<any>();
  @Output() menuAction = new EventEmitter<{ action: string; node: any }>();

  filterTerm = '';
  private _filteredNodes: any[] = [];

  selectedNode: any = null;
  expandedNodes = new Set<string>();
  expandedKeys: { [key: string]: boolean } = {};
  checkedNodes = new Set<string>();

  readonly contextMenuVisible = signal(false);
  contextMenuX = 0;
  contextMenuY = 0;

  private documentClickListener?: () => void;

  get displayNodes(): any[] {
    if (!this.showFilter || !this.filterTerm.trim()) return this.nodes;
    return this._filteredNodes;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodes']) {
      this.expandFirstLevel();
      this.updateExpandedKeys();

      if (this.showFilter && this.filterTerm.trim()) {
        this._filteredNodes = this.filterTreeNodes(this.nodes, this.filterTerm.trim().toLowerCase());
        this.expandFilteredNodes(this._filteredNodes);
      }
    }
  }

  ngAfterViewInit(): void {
    this.documentClickListener = this.renderer.listen('document', 'click', (event: Event) => {
      if (this.contextMenuVisible()) {
        this.hideContextMenu();
      }
    });
  }

  ngOnDestroy(): void {
    this.documentClickListener?.();
    if (this.ctxMenuRef?.nativeElement?.parentElement === document.body) {
      document.body.removeChild(this.ctxMenuRef.nativeElement);
    }
  }

  onFilterChange(term: string): void {
    this.filterTerm = term;
    if (!term.trim()) {
      this._filteredNodes = [];
      return;
    }
    this._filteredNodes = this.filterTreeNodes(this.nodes, term.trim().toLowerCase());
    this.expandFilteredNodes(this._filteredNodes);
  }

  onNodeClickEvent(event: any): void {
    const node = event.node;
    this.selectedNode = node;
    this.nodeClick.emit(node);
  }

  onNodeExpandEvent(event: any): void {
    const node = event.node;
    if (node.isHeader && !node.childrenLoaded) {
      this.nodeExpand.emit(node);
    }
  }

  onExpandedKeysChange(keys: { [key: string]: boolean }): void {
    this.expandedKeys = keys;
    this.expandedNodes.clear();
    Object.keys(keys).forEach(key => {
      if (keys[key]) {
        this.expandedNodes.add(key);
      }
    });
  }

  toggleNode(node: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.expandedNodes.has(node.id)) {
      this.expandedNodes.delete(node.id);
      this.expandedKeys[node.id] = false;
    } else {
      this.expandedNodes.add(node.id);
      this.expandedKeys[node.id] = true;

      if (node.isHeader && !node.childrenLoaded) {
        this.nodeExpand.emit(node);
      }
    }

    this.expandedKeys = { ...this.expandedKeys };
  }

  isExpanded(node: any): boolean {
    return this.expandedNodes.has(node.id);
  }

  hasChildren(node: any): boolean {
    return Array.isArray(node.children) && node.children.length > 0;
  }

  isChecked(node: any): boolean {
    return this.checkedNodes.has(node.id);
  }

  onCheckboxChange(node: any, checked: boolean): void {
    this.applyCheckToNodeAndChildren(node, checked);
    if (checked) {
      this.checkAncestors(node, this.nodes);
    } else {
      this.uncheckAncestorsIfNeeded(node, this.nodes);
    }
  }

  onContextMenu(event: MouseEvent, node: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedNode = node;
    this.nodeClick.emit(node);
    this.showContextMenu(event.clientX, event.clientY);
  }

  onMenuItemClick(action: string): void {
    this.hideContextMenu();
    switch (action) {
      case 'expand-node':
        this.expandAll();
        break;
      case 'collapse-node':
        this.collapseAll();
        break;
      case 'print':
        this.printTree();
        break;
      default:
        this.emitAction(action);
    }
  }

  private showContextMenu(x: number, y: number): void {
    this.contextMenuX = x;
    this.contextMenuY = y;
    this.contextMenuVisible.set(true);

    if (this.ctxMenuRef?.nativeElement?.parentElement !== document.body) {
      document.body.appendChild(this.ctxMenuRef!.nativeElement);
    }
  }

  hideContextMenu(): void {
    this.contextMenuVisible.set(false);
    if (this.ctxMenuRef?.nativeElement?.parentElement === document.body) {
      document.body.removeChild(this.ctxMenuRef.nativeElement);
    }
  }

  private emitAction(action: string): void {
    this.menuAction.emit({ action, node: this.selectedNode });
  }

  expandAll(): void {
    const recurse = (nodes: any[]) => {
      nodes.forEach(n => {
        this.expandedNodes.add(n.id);
        this.expandedKeys[n.id] = true;
        if (n.children) recurse(n.children);
      });
    };
    recurse(this.nodes);
    this.expandedKeys = { ...this.expandedKeys };
  }

  collapseAll(): void {
    this.expandedNodes.clear();
    this.expandedKeys = {};
  }

  expandNodeChildren(node: any): void {
    if (!node) return;
    this.expandedNodes.add(node.id);
    this.expandedKeys[node.id] = true;

    const recurse = (children: any[]) => {
      children.forEach(c => {
        this.expandedNodes.add(c.id);
        this.expandedKeys[c.id] = true;
        if (c.children) recurse(c.children);
      });
    };

    if (node.children) recurse(node.children);
    this.expandedKeys = { ...this.expandedKeys };
  }

  collapseNodeChildren(node: any): void {
    if (!node) return;

    const recurse = (children: any[]) => {
      children.forEach(c => {
        this.expandedNodes.delete(c.id);
        delete this.expandedKeys[c.id];
        if (c.children) recurse(c.children);
      });
    };

    if (node.children) recurse(node.children);
    this.expandedNodes.delete(node.id);
    delete this.expandedKeys[node.id];
    this.expandedKeys = { ...this.expandedKeys };
  }

  printTree(): void {
    const buildHtml = (nodes: any[], level: number): string => {
      return nodes
        .map(n => {
          const indent = level * 20;
          const icon = this.isFolderNode(n) ? '📁' : '📄';
          let html = `<div style="padding-right:${indent}px;padding:2px 0;font-size:13px;direction:rtl">${icon} ${n.label ?? ''}</div>`;
          if (n.children?.length) html += buildHtml(n.children, level + 1);
          return html;
        })
        .join('');
    };

    const content = buildHtml(this.nodes, 0);
    const win = window.open('', '_blank', 'width=700,height=800');
    if (!win) return;
    win.document.write(
      `<html dir="rtl"><head><title>شجرة الحسابات</title></head><body style="font-family:Segoe UI,Tahoma,Arial,sans-serif"><h2 style="text-align:center">شجرة الحسابات</h2>${content}</body></html>`
    );
    win.document.close();
    win.print();
  }

  private applyCheckToNodeAndChildren(node: any, checked: boolean): void {
    if (!node) return;

    const nodeId = node.id;
    if (typeof nodeId === 'string' && nodeId.length > 0) {
      if (checked) {
        this.checkedNodes.add(nodeId);
      } else {
        this.checkedNodes.delete(nodeId);
      }
      this.nodeCheck.emit({ node, checked });
    }

    if (!Array.isArray(node.children) || node.children.length === 0) {
      return;
    }

    for (const child of node.children) {
      this.applyCheckToNodeAndChildren(child, checked);
    }
  }

  private checkAncestors(target: any, roots: any[]): void {
    const path = this.findPathToNode(target, roots);
    if (!path) return;

    for (let i = 0; i < path.length - 1; i++) {
      const ancestor = path[i];
      if (ancestor?.id && !this.checkedNodes.has(ancestor.id)) {
        this.checkedNodes.add(ancestor.id);
        this.nodeCheck.emit({ node: ancestor, checked: true });
      }
    }
  }

  private uncheckAncestorsIfNeeded(target: any, roots: any[]): void {
    const path = this.findPathToNode(target, roots);
    if (!path) return;

    for (let i = path.length - 2; i >= 0; i--) {
      const ancestor = path[i];
      if (!ancestor?.id) continue;
      if (this.hasCheckedDescendant(ancestor)) {
        break;
      }
      this.checkedNodes.delete(ancestor.id);
      this.nodeCheck.emit({ node: ancestor, checked: false });
    }
  }

  private hasCheckedDescendant(node: any): boolean {
    if (!Array.isArray(node.children)) return false;
    for (const child of node.children) {
      if (this.checkedNodes.has(child.id)) return true;
      if (this.hasCheckedDescendant(child)) return true;
    }
    return false;
  }

  private findPathToNode(target: any, nodes: any[]): any[] | null {
    for (const node of nodes) {
      if (node.id === target.id) return [node];
      if (Array.isArray(node.children) && node.children.length > 0) {
        const childPath = this.findPathToNode(target, node.children);
        if (childPath) return [node, ...childPath];
      }
    }
    return null;
  }

  private filterTreeNodes(nodes: any[], term: string): any[] {
    const result: any[] = [];
    for (const node of nodes) {
      const children = node.children ? this.filterTreeNodes(node.children, term) : [];
      const nodeText = `${node.label ?? ''} ${node.code ?? ''} ${node.name ?? ''}`.toLowerCase();
      if (nodeText.includes(term) || children.length > 0) {
        result.push({ ...node, children });
      }
    }
    return result;
  }

  private expandFilteredNodes(nodes: any[]): void {
    for (const node of nodes) {
      if (node.children?.length > 0) {
        this.expandedNodes.add(node.id);
        this.expandedKeys[node.id] = true;
        this.expandFilteredNodes(node.children);
      }
    }
    this.expandedKeys = { ...this.expandedKeys };
  }

  private expandFirstLevel(): void {
    const rootIds = (this.nodes ?? [])
      .map(node => node.id)
      .filter((id): id is string => typeof id === 'string' && id.length > 0);

    for (const id of rootIds) {
      this.expandedNodes.add(id);
      this.expandedKeys[id] = true;
    }
    this.expandedKeys = { ...this.expandedKeys };
  }

  private updateExpandedKeys(): void {
    this.expandedKeys = {};
    this.expandedNodes.forEach(id => {
      this.expandedKeys[id] = true;
    });
  }

  private isFolderNode(node: any): boolean {
    if (!node || typeof node !== 'object') {
      return false;
    }

    if (this.isTruthyFlag(node.isHeader) || this.isTruthyFlag(node.isMain)) {
      return true;
    }

    const data = node.data;
    if (data && typeof data === 'object') {
      const accountData = data as { isHeader?: unknown; isMain?: unknown; parentId?: string | null; fatherNumber?: string | null };

      if (this.isTruthyFlag(accountData.isHeader) || this.isTruthyFlag(accountData.isMain)) {
        return true;
      }

      if (!accountData.parentId && !accountData.fatherNumber) {
        return true;
      }
    }

    return Array.isArray(node.children) && node.children.length > 0;
  }

  private isTruthyFlag(value: unknown): boolean {
    return value === true || value === 1 || value === '1' || value === 'true';
  }

  nodeIcon(node: any): string {
    return this.isFolderNode(node) ? '📁' : '📄';
  }

  trackByNode(index: number, node: any): string {
    return node.id;
  }

  constructor(private renderer: Renderer2) {}
}
