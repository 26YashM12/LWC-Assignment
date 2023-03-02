/** @ Author: Bhavya Mathur
 * 	@ Date Created: 12:02:2023
 *  @ Name: Queable
*/

public with sharing class AccountQueueable implements Queueable {
    private String stateAbbreviation;

    public AccountQueueable(String stateAbbreviation) {
        this.stateAbbreviation = stateAbbreviation;
    }

    public void execute(QueueableContext context) {
        List<Account> accounts = [SELECT Id, BillingState FROM Account WHERE BillingState = :stateAbbreviation LIMIT 200];
        for (Account account : accounts) {
            account.BillingState = this.stateAbbreviation;
        }
        update accounts;
    }
}