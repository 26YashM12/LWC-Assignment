public with sharing class AccountController2 {
    public AccountController2() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        List<Account> accounts = [SELECT Id, Name, Type, ParentId, Website, Phone, Rating FROM Account];
        return accounts;
    }
    @AuraEnabled
    public static void deleteAccount(Account objaccount){
        try {
            delete objaccount;
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactRecords(string accId){
        List<Contact> conlist = new List<Contact>();
        for(Contact con:[Select Id, FirstName, LastName, Email, Phone, AccountId From Contact WHERE AccountId=:accId]){
            conlist.add(con);
        }
        return conlist;
        }
    }