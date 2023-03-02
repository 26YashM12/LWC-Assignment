public class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        List<Account> accounts = [SELECT Id, Name, Type, Website, Phone, Rating FROM Account];
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
 }
