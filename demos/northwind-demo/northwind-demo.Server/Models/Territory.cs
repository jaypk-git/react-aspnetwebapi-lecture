﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace northwind_demo.Server.Models;

public partial class Territory
{
    public string TerritoryId { get; set; }

    public string TerritoryDescription { get; set; }

    public int RegionId { get; set; }

    public virtual ICollection<EmployeeTerritory> EmployeeTerritories { get; set; } = new List<EmployeeTerritory>();

    public virtual Region Region { get; set; }
}