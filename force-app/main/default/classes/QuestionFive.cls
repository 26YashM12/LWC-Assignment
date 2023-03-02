public class QuestionFive {
    public static void GetAccountContact(String AccountId)
    {
        List<Contact> relatedContacts = [Select Name From Contact where Account.Id=:AccountId];
        System.debug(relatedContacts);
    }
}