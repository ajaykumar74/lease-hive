import { Route, Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthGuard } from '@/shared/auth-guard.service';
import { BusinessFeatureComponent } from './business-feature.component';

interface BillingFinancePage {
    path: string;
    title: string;
    icon: string;
}

const placeholderPages: BillingFinancePage[] = [
    { path: 'dashboard', title: 'Billing & Finance Dashboard', icon: 'pi pi-chart-bar' },
    { path: 'billing/workbench', title: 'Billing Workbench', icon: 'pi pi-desktop' },
    { path: 'billing/history', title: 'Billing History', icon: 'pi pi-history' },
    { path: 'invoices/drafts', title: 'Draft Invoices', icon: 'pi pi-pencil' },
    { path: 'invoices/pending-approval', title: 'Invoices Pending Approval', icon: 'pi pi-clock' },
    { path: 'invoices/issued', title: 'Issued Invoices', icon: 'pi pi-check-circle' },
    { path: 'receivables/open', title: 'Open Receivables', icon: 'pi pi-list' },
    { path: 'receivables/overdue', title: 'Overdue Receivables', icon: 'pi pi-exclamation-circle' },
    { path: 'receivables/ageing', title: 'Ageing Analysis', icon: 'pi pi-chart-bar' },
    { path: 'receivables/disputed', title: 'Disputed / On Hold', icon: 'pi pi-pause-circle' },
    { path: 'payments/unapplied', title: 'Unapplied Receipts', icon: 'pi pi-question-circle' },
    { path: 'payments/allocation-history', title: 'Allocation History', icon: 'pi pi-history' },
    { path: 'payments/reversed', title: 'Reversed Receipts', icon: 'pi pi-undo' },
    { path: 'deposits/utilization', title: 'Deposit Utilization', icon: 'pi pi-arrow-right' },
    { path: 'deposits/refunds', title: 'Deposit Refunds', icon: 'pi pi-replay' },
    { path: 'deposits/forfeitures', title: 'Deposit Forfeitures', icon: 'pi pi-times-circle' },
    { path: 'accounting/posting', title: 'Posting Workbench', icon: 'pi pi-send' },
    { path: 'accounting/posting-exceptions', title: 'Posting Exceptions', icon: 'pi pi-exclamation-triangle' },
    { path: 'accounting/posting-history', title: 'Posting History', icon: 'pi pi-history' },
    { path: 'reconciliation/unmatched', title: 'Unmatched Transactions', icon: 'pi pi-exclamation-circle' },
    { path: 'reconciliation/history', title: 'Reconciliation History', icon: 'pi pi-history' },
    { path: 'reports/billing-summary', title: 'Billing Summary', icon: 'pi pi-chart-bar' },
    { path: 'reports/invoice-register', title: 'Invoice Register', icon: 'pi pi-list' },
    { path: 'reports/receivables-ageing', title: 'Receivables Ageing', icon: 'pi pi-chart-bar' },
    { path: 'reports/collection-summary', title: 'Collection Summary', icon: 'pi pi-chart-line' },
    { path: 'reports/deposit-register', title: 'Deposit Register', icon: 'pi pi-list' },
    { path: 'reports/tax-summary', title: 'Tax Summary', icon: 'pi pi-percentage' },
    { path: 'reports/journal-register', title: 'Journal Register', icon: 'pi pi-book' },
    { path: 'reports/reconciliation', title: 'Reconciliation Report', icon: 'pi pi-sync' },
    { path: 'configuration/billing', title: 'Billing Setup', icon: 'pi pi-cog' },
    { path: 'configuration/calendars', title: 'Billing Calendars', icon: 'pi pi-calendar' },
    { path: 'configuration/payment-terms', title: 'Payment Terms', icon: 'pi pi-calendar-clock' },
    { path: 'configuration/tax-mapping', title: 'Tax Mapping', icon: 'pi pi-percentage' },
    { path: 'configuration/numbering', title: 'Numbering Rules', icon: 'pi pi-sort-numeric-up' },
    { path: 'configuration/approval-rules', title: 'Approval Rules', icon: 'pi pi-check-circle' },
    { path: 'configuration/integrations', title: 'Integration Setup', icon: 'pi pi-link' }
];

const moduleRoutes: Routes = [
    route('billing/runs', 'Billing Runs', () => import('@/views/billings/billingRun/billingRun.module').then(m => m.BillingRunModule)),
    route('billing/candidates', 'Billing Candidates', () => import('@/views/billings/billingRunItem/billingRunItem.module').then(m => m.BillingRunItemModule)),
    route('billing/exceptions', 'Billing Exceptions', () => import('@/views/billings/financeException/financeException.module').then(m => m.FinanceExceptionModule)),
    route('invoices/lines', 'Invoice Lines', () => import('@/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine.module').then(m => m.CustomerInvoiceLineModule)),
    route('invoices/taxes', 'Invoice Taxes', () => import('@/views/billings/customerInvoiceTax/customerInvoiceTax.module').then(m => m.CustomerInvoiceTaxModule)),
    route('invoices', 'Customer Invoices', () => import('@/views/billings/customerInvoice/customerInvoice.module').then(m => m.CustomerInvoiceModule)),
    route('credit-notes/lines', 'Credit Note Lines', () => import('@/views/billings/creditNoteLine/creditNoteLine.module').then(m => m.CreditNoteLineModule)),
    route('credit-notes', 'Credit Notes', () => import('@/views/billings/creditNote/creditNote.module').then(m => m.CreditNoteModule)),
    route('debit-notes/lines', 'Debit Note Lines', () => import('@/views/billings/debitNoteLine/debitNoteLine.module').then(m => m.DebitNoteLineModule)),
    route('debit-notes', 'Debit Notes', () => import('@/views/billings/debitNote/debitNote.module').then(m => m.DebitNoteModule)),
    route('receivables', 'Accounts Receivable', () => import('@/views/billings/receivable/receivable.module').then(m => m.ReceivableModule)),
    route('customer-statements', 'Customer Statements', () => import('@/views/billings/customerStatementSnapshot/customerStatementSnapshot.module').then(m => m.CustomerStatementSnapshotModule)),
    route('payments/receipts', 'Payment Receipts', () => import('@/views/billings/paymentReceipt/paymentReceipt.module').then(m => m.PaymentReceiptModule)),
    route('payments/allocation', 'Payment Allocation', () => import('@/views/billings/paymentAllocation/paymentAllocation.module').then(m => m.PaymentAllocationModule)),
    route('deposits/transactions', 'Deposit Transactions', () => import('@/views/billings/depositTransaction/depositTransaction.module').then(m => m.DepositTransactionModule)),
    route('deposits', 'Customer Deposits', () => import('@/views/billings/customerDeposit/customerDeposit.module').then(m => m.CustomerDepositModule)),
    route('accounting/events', 'Accounting Events', () => import('@/views/billings/accountingEvent/accountingEvent.module').then(m => m.AccountingEventModule)),
    route('accounting/journals/lines', 'Journal Entry Lines', () => import('@/views/billings/journalEntryLine/journalEntryLine.module').then(m => m.JournalEntryLineModule)),
    route('accounting/journals', 'Journal Entries', () => import('@/views/billings/journalEntry/journalEntry.module').then(m => m.JournalEntryModule)),
    route('bank/statements', 'Bank Statements', () => import('@/views/billings/bankStatement/bankStatement.module').then(m => m.BankStatementModule)),
    route('bank/transactions', 'Bank Transactions', () => import('@/views/billings/bankStatementLine/bankStatementLine.module').then(m => m.BankStatementLineModule)),
    route('reconciliation', 'Reconciliation Workbench', () => import('@/views/billings/financeReconciliation/financeReconciliation.module').then(m => m.FinanceReconciliationModule)),
    route('control/approval-actions', 'Finance Approval Actions', () => import('@/views/billings/financeApprovalAction/financeApprovalAction.module').then(m => m.FinanceApprovalActionModule)),
    route('control/approvals', 'Finance Approvals', () => import('@/views/billings/financeApprovalRequest/financeApprovalRequest.module').then(m => m.FinanceApprovalRequestModule)),
    route('control/exceptions', 'Finance Exceptions', () => import('@/views/billings/financeException/financeException.module').then(m => m.FinanceExceptionModule)),
    route('control/documents', 'Finance Documents', () => import('@/views/billings/financeDocumentLink/financeDocumentLink.module').then(m => m.FinanceDocumentLinkModule)),
    route('control/handoffs', 'Finance Handoffs', () => import('@/views/billings/financeHandoff/financeHandoff.module').then(m => m.FinanceHandoffModule)),
    route('configuration/billing-run-statuses', 'Billing Run Statuses', () => import('@/views/billings/billingRunStatus/billingRunStatus.module').then(m => m.BillingRunStatusModule)),
    route('configuration/invoice-statuses', 'Invoice Statuses', () => import('@/views/billings/invoiceStatus/invoiceStatus.module').then(m => m.InvoiceStatusModule)),
    route('configuration/receipt-statuses', 'Receipt Statuses', () => import('@/views/billings/receiptStatus/receiptStatus.module').then(m => m.ReceiptStatusModule)),
    route('configuration/account-mapping', 'Finance Account Mapping', () => import('@/views/billings/financeAccountMapping/financeAccountMapping.module').then(m => m.FinanceAccountMappingModule))
];

const modulePaths = new Set(moduleRoutes.map(item => item.path));
const featureRoutes: Routes = [
    ...moduleRoutes,
    ...placeholderPages.filter(page => !modulePaths.has(page.path)).map(page => ({
        path: page.path,
        component: BusinessFeatureComponent,
        data: { title: page.title, area: 'Billing & Finance', icon: page.icon, breadcrumb: page.title }
    }))
].sort((left, right) => (right.path?.split('/').length ?? 0) - (left.path?.split('/').length ?? 0));

export const BILLING_FINANCE_ROUTES: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: featureRoutes
    }
];

function route(path: string, title: string, loadChildren: NonNullable<Route['loadChildren']>): Route {
    return { path, data: { title, breadcrumb: title }, loadChildren };
}
