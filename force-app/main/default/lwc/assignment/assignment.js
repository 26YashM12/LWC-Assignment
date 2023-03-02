import { LightningElement ,api, wire, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccountList from '@salesforce/apex/AccountController2.getAccountList';
import deleteAccount from '@salesforce/apex/AccountController2.deleteAccount';
import { NavigationMixin } from 'lightning/navigation';

//define row actions
const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
    { label: 'Related Account', name: 'related account' },
    { label: 'Related Contact', name: 'Related contact' }
 ];

const col= [{
    label: 'Account name',
    fieldName: 'Name',
    type: 'text',
    sortable: true,
    editable: true
},
{
    label: 'Type',
    fieldName: 'Type',
    type: 'text',
    sortable: true,
    editable: true
},
{
    label: 'Phone',
    fieldName: 'Phone',
    type: 'phone',
    sortable: true,
    editable: true
},
{
    label: 'Website',
    fieldName: 'Website',
    type: 'url',
    sortable: true,
    editable: true
},
{
    label: 'Rating',
    fieldName: 'Rating',
    type: 'test',
    sortable: true,
    editable: true
},

{
    type: 'action',
    typeAttributes: {
        rowActions: actions,
        menuAlignment: 'right'
    }
}
];

export default class Assignment extends NavigationMixin(LightningElement) {
    columns=col;
    @api parentId;
    @api recordId;
    draftValues=[];
    @api showLoadingSpinner=false;
    record={};
    @track data;
    @track items;
    @track startingRecord=1;
    @track page=1;
    @track endingRecord=0;
    @track totalRecordCount;
    @track totalPage;
    @track pageSize=7;
    record = {};   
    @api childComponent=false;
    @api relatedContactComponent=false;
    @api retrievedRecordId=false

@api recordParentId;
draftValues = [];
    showChild = false;
    @wire(getAccountList) accounts(result)
    {
        if(result.data)
        {
            this.items=result.data;
            this.totalRecordCount=result.data.length;
            this.totalPage=Math.ceil(this.totalRecordCount/this.pageSize);
            this.data=this.items.slice(0,this.pageSize);
            this.endingRecord=this.pageSize;
        
        
        }
                  
              
        }
        
        
        prevHandler(event){
            if(this.page>1)
            {
                this.page= this.page-1;
                this.displayRecordPerPage(this.page);
            }
        }
        nextHandler(event){
            if(this.page<this.totalPage && this.page!==this.totalPage)
            {
                this.page= this.page+1;
                this.displayRecordPerPage(this.page);
            }
        }
        displayRecordPerPage(page)
        {
            this.startingRecord=(page-1)*this.pageSize;
            this.endingRecord=page*this.pageSize;
            this.endingRecord=(this.endingRecord > this.totalRecordCount)?this.totalRecordCount:this.endingRecord;
            this.data=this.items.slice(this.startingRecord,this.endingRecord);
            this.startingRecord=this.startingRecord+1;
        
        
        }
    

    
   
   
  


    handleRowActions(event) {
        const actionName = event.detail.action.name;
        this.parentId=event.detail.row.ParentId;
        const row = event.detail.row;
        this.recordId = event.detail?.row?.Id;
        switch (actionName) {
            case 'Related contact':
                this.showChild = true;
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: this.recordId,
                        objectApiName: 'Account',
                        actionName: 'edit'
                    }  
                    
                });
                break;
            case 'related account':
                this[NavigationMixin.GenerateUrl]({
                    type:"standard__recordPage",
                    attributes: {
                        recordId: this.parentId,
                        objectApiName: 'Account',
                        actionName: 'view'
                    },
            
                }).then(url=>{
                    window.open(url,"_blank");
                });
                break;
                    
            case 'delete':
                this.delAccount(row);
                break;
        }
    }

navigationToRelatedAccount(){
    this[NavigationMixin.GenerateUrl]({
        type:"standard__recordPage",
        attributes: {
            recordId: this.parentId,
            objectApiName: 'Account',
            actionName: 'view'
        },

    }).then(url=>{
        window.open(url,"_blank");
    });
}  


// This function deletes an account record and shows a success message, or an error message if the operation fails.
// It takes in a row object representing the account record to be deleted.
delAccount(currentRow) {
this.showLoadingSpinner = true;


// Call the deleteAccount function, passing in the currentRow object as a parameter. This function returns a Promise.
deleteAccount({ objaccount: currentRow }).then(result => {
    window.console.log('result^^' + result);

    
    // Hide the loading spinner.
    this.showLoadingSpinner = false;
    

    // Dispatch a toast event with a success message indicating that the account was deleted.
    this.dispatchEvent(new ShowToastEvent({
        title: 'Success!!',
        message: currentRow.Name + ' account deleted.',
        variant: 'success'
    }));

    
    // Refresh the table to reflect the updated data.
    return refreshApex(this.refreshTable);
}).catch(error => {
    window.console.log('Error ====> ' + error);
    this.showLoadingSpinner = false;
    

    // Dispatch a toast event with an error message indicating that the operation failed.
    this.dispatchEvent(new ShowToastEvent({
        title: 'Error!!',
        message: JSON.stringify(error),
        variant: 'error'
    }));
});
}


    async handleSave(event) {
        
      // Convert datatable draft values into record objects
    const records = event.detail.draftValues.slice().map((draftValue) => {
        const fields = Object.assign({}, draftValue);
        return { fields };
    });

    // Clear all datatable draft values
    this.draftValues = [];

    try {
        // Update all records in parallel thanks to the UI API
        const recordUpdatePromises = records.map((record) =>
            updateRecord(record)
        );
        await Promise.all(recordUpdatePromises);


        // Report success with a toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Account updated',
                variant: 'success'
            })
        );

        // Display fresh data in the datatable
        await refreshApex(this.wiredAccounts);
    } catch (error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error updating or reloading account',
                message: error.body.message,
                variant: 'error'
            })
        );
    
    }
    }

        hideContacts(event){
            this.showChild = false;
        }

    
    }