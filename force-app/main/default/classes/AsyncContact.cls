/** @ Author: Bhavya Mathur
 * 	@ Date Created: 12:02:2023
 *  @ Name: Async Contact
*/

public class AsyncContact implements Database.Batchable<sObject>{
    public Database.QueryLocator start (Database.BatchableContext BC){
        return Database.getQueryLocator ([Select id From Contact Where Birthdate < 2020-01-01 AND Birthdate > 1999-12-31 ]);
    }
    public void execute(Database.BatchableContext BC, List<Contact> scope)
    {
        List<Contact> con = new List<Contact>(); 
        for (Contact c: scope){
            c.description='Will likely to face the Pandemic';
            c.MailingCity='Jaipur';
            c.MailingState='Rajasthan';
            c.MailingCountry='India';
            c.MailingPostalCode='302020'; 
            c.Mailingstreet = 'Street 1';
            con.add(c);
        }    
        Update con;
    }
    public void finish(Database.BatchableContext BC){
        
    }
}