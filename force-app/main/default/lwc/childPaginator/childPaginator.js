import { LightningElement } from 'lwc';

export default class ChildPaginator extends LightningElement {
    //onclick of previous sending info to parent component
    handlePrevious(event)
    {
        this.dispatchEvent(new CustomEvent('previous'));

    }
    //onclick of next sending info to parent component
    handleNext(event)
    {
        this.dispatchEvent(new CustomEvent('next'));
        
    }
}