namespace EmployeeManagement.Server.Models
{
    public class TerritoryDTO
    {
        public string TerritoryID { get; set; }
        public string TerritoryDescription { get; set; }
        public int RegionID { get; set; }
        public bool IsSelected { get; internal set; }
    }
}
