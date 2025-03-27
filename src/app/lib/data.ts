import {
    CustomerField,
    CustomersTableType,
    Invoice,
    InvoiceForm,
    InvoicesTable,
    LatestInvoice,
    LatestInvoiceRaw,
    Revenue,
} from './definitions';
import { users, customers, invoices, revenue } from './placeholder-data';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
    try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return revenue;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
}

export async function fetchLatestInvoices() {
    try {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const latestInvoices: LatestInvoice[] = invoices.map((invoice) => {

            const customer = customers.find((customer) => customer.id === invoice.customer_id);

            return {
                ...invoice,
                amount: formatCurrency(invoice.amount),
                id: invoice.id,
                name: customer?.name || "",
                image_url: customer?.image_url || "",
                email: customer?.email || ""
            }
        });
        console.log('Latest Invoices:', latestInvoices);
        return latestInvoices;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    }
}

export async function fetchCardData() {
    try {
        // Mocked database calls with delays
        const mockInvoiceCount = () =>
            new Promise((resolve) => setTimeout(() => resolve([{ count: invoices.length }]), 1000)); // Mock 42 invoices
        const mockCustomerCount = () =>
            new Promise((resolve) => setTimeout(() => resolve([{ count: customers.length }]), 1000)); // Mock 15 customers
        const mockInvoiceStatus = () =>
            new Promise((resolve) =>
                setTimeout(
                    () =>
                        resolve([
                            {
                                paid: invoices.reduce((sum, invoice) => {
                                    return invoice.status === 'paid' ? sum + invoice.amount : sum;
                                }, 0), // Mock total paid amount
                                pending: invoices.reduce((sum, invoice) => {
                                    return invoice.status === 'pending' ? sum + invoice.amount : sum;
                                }, 0), // Mock total pending amount
                            },
                        ]),
                    1000
                )
            );

        // Replace SQL queries with mocked calls
        const invoiceCountPromise = mockInvoiceCount();
        const customerCountPromise = mockCustomerCount();
        const invoiceStatusPromise = mockInvoiceStatus();

        const data: any[any] = await Promise.all([
            invoiceCountPromise,
            customerCountPromise,
            invoiceStatusPromise,
        ]);

        const numberOfInvoices = Number(data[0][0].count ?? '0');
        const numberOfCustomers = Number(data[1][0].count ?? '0');
        const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
        const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

        return {
            numberOfCustomers,
            numberOfInvoices,
            totalPaidInvoices,
            totalPendingInvoices,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch card data.');
    }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
    query: string,
    currentPage: number,
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {

        const latestInvoices: any[] = invoices.map((invoice) => {

            const customer = customers.find((customer) => customer.id === invoice.customer_id);

            return {
                ...invoice,
                amount: formatCurrency(invoice.amount),
                id: invoice.id,
                name: customer?.name || "",
                image_url: customer?.image_url || "",
                email: customer?.email || ""
            }
        })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .filter((invoice) => {
                return (invoice.email.toLowerCase().includes(query.toLowerCase()) ||
                    invoice.name.toLowerCase().includes(query.toLowerCase()) ||
                    invoice.amount.toString().includes(query) ||
                    invoice.date.includes(query) ||
                    invoice.status.toLowerCase().includes(query.toLowerCase()))
            })
            .slice(offset, offset + ITEMS_PER_PAGE);

        return latestInvoices;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoices.');
    }
}

export async function fetchInvoicesPages(query: string) {
    try {
        const latestInvoices: LatestInvoice[] = invoices.map((invoice) => {

            const customer = customers.find((customer) => customer.id === invoice.customer_id);

            return {
                ...invoice,
                amount: formatCurrency(invoice.amount),
                id: invoice.id,
                name: customer?.name || "",
                image_url: customer?.image_url || "",
                email: customer?.email || ""
            }
        })
            .filter((invoice) => {
                invoice.email.toLowerCase().includes(query.toLowerCase()) ||
                    invoice.name.toLowerCase().includes(query.toLowerCase()) ||
                    invoice.amount.toString().includes(query) ||
                    invoice.date.includes(query) ||
                    invoice.status.toLowerCase().includes(query.toLowerCase())
            });

        const totalPages = Math.ceil(Number(latestInvoices.length) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of invoices.');
    }
}

export async function fetchCustomers() {
    try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return customers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchInvoiceById(id: string) {
    try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const invoice = invoices.map((invoice) => ({
            ...invoice,
            // Convert amount from cents to dollars
            amount: invoice.amount / 100,
            status: invoice.status === "pending" || invoice.status === "paid" ? invoice.status : "pending",
        }));

        return invoice[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoice.');
    }
}