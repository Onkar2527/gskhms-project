export class GTemplate {
  [x: string]: any;
  id!: number;
  operation_name!:string;
  pre_op!:string;
  procedure_op!:string;
  post_op!:string;
  addition_description!:string;
  treatment!:string;




  constructor() {
        this.id = 0;
        this.operation_name='';
        this.pre_op='';
        this.procedure_op='';
        this.post_op='';
        this.addition_description='';
        this.treatment='';
  }

}