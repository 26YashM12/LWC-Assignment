import { api, LightningElement,wire } from 'lwc';
import getContactRecords from '@salesforce/apex/AccountController2.getContactRecords';
const employeeColumns = [{
    label: 'First Name',
    fieldName: 'FirstName',
    type: 'text',
    sortable: true,
    editable: true,
    },
    
    {
    label: 'Last Name',
    fieldName: 'LastName',
    type: 'text',
    sortable: true,
    editable: true,
    },
    
    {
    label: 'Phone',
    fieldName: 'Phone',
    type: 'phone',
    sortable: true,
    editable: true,
    },
]
export default class childComponent extends LightningElement {
    @api accountId;
    recordsId;
    columns= employeeColumns;
    connectedCallback(){
        this.recordsId = this.accountId;
        window.console.log(this.recordsId);
    }
    @wire(getContactRecords, {accId : "$recordsId"})
    contacts;
}