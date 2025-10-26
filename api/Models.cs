public class ImageModel
{
    public int Id {get;set;}
    public byte[] ImageData {get;set;}
    public string ImageType {get;set;}
    public string Name {get;set;}
    public string Description {get;set;}
    public string Destination {get;set;}

}

public class PriceListModel
{
    public int Id {get;set;}
    public string Title {get;set;}
    public int Price {get;set;}

}

public class FeedbackRequestModel
{
    public int Id {get;set;}
    public string Name {get;set;}
    public string Email {get;set;}
    public string Message {get;set;}
}
