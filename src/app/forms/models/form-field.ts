export interface FormField {

  type: 'text'
      | 'email'
      | 'number'
      | 'checkbox'
      | 'select';

  name: string;

  label: string;

  value?: any;

  required?: boolean;

  options?: string[];

}