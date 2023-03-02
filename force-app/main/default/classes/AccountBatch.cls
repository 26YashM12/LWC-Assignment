/** @Author: Bhavya Mathur
 *  @Date Created: 09:02:2023
 *  @Name: Account Batch
*/
public class AccountBatch implements Database.Batchable<sObject> {
    
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([SELECT Id, Description FROM Account]);
    }
    public void execute(Database.BatchableContext bc, List<Account> records){
        List<Account> acc = new List <Account>();
        for (Account a : records) {
            a.Description = 'AccountBatch has updated the record';
            acc.add(a);
        }
        update acc;

    }
    public void finish(Database.BatchableContext bc){
    }
}