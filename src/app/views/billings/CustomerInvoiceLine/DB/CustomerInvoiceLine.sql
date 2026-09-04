 

/****** Object:  Table [dbo].[Projects]    Script Date: 08-04-2024 17:23:37 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CustomerInvoiceLines](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TenantId] [int] ,
[CustomerInvoiceId] [int] ,
[LineNo] [smallint] ,
[LeaseContractId] [int] NULL,
[LeasePaymentScheduleLineId] [int] NULL,
[LeaseContractChargeId] [int] NULL,
[LeaseContractAssetId] [int] NULL,
[ChargeTypeCode] [Varchar](20) ,
[Description] [NVARCHAR] (100) ,
[ServicePeriodFrom] [Date]  NULL,
[ServicePeriodTo] [Date]  NULL,
[Quantity] [smallmoney] ,
[UOMId] [int] NULL,
[UnitPrice] [Decimal] (12,2)  ,
[DiscountAmount] [smallmoney] ,
[TaxableAmount] [Decimal] (12,2)  ,
[TaxAmount] [Decimal] (12,2)  ,
[LineGrossAmount] [Decimal] (12,2)  ,
[RecordStatus] [Varchar](20) ,

	[CreatedById] [int] NULL,
	[CreatedByCode] [varchar](20) NULL,
	[CreatedDateTime] [datetime2](2) NULL,
	[ModifiedById] [int] NULL,
	[ModifiedByCode] [varchar](20) NULL,
	[ModifiedDateTime] [datetime2](2) NULL,
	[RowVersion] [timestamp] NOT NULL
) ON [PRIMARY]
GO 



GO

