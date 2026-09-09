const products = [
    {
        gtin: '8901030985223',
        name: 'Premium Basmati Rice',
        brand: 'ABC Foods',
        vendor: 'Verified FMCG Vendor',
        mrp: '150.00',
        netQuantity: '500 g',
        manufacturerAddress: 'ABC Foods India Pvt Ltd, Delhi'
    },
    {
        gtin: '890439001122',
        name: 'Sunrise Detergent',
        brand: 'Sunrise',
        vendor: 'Sunrise LLC',
        mrp: '80.00',
        netQuantity: '1 kg',
        manufacturerAddress: 'Sunrise Industrial Park, Pune'
    }
];

const inspections = [
    {
        id: 'CASE-101',
        gtin: '8901030985223',
        location: 'Coimbatore Hub',
        date: '2026-09-05T11:00:00Z',
        extractedMrp: '150.00',
        extractedQty: '500 g',
        status: 'COMPLIANT'
    },
    {
        id: 'CASE-102',
        gtin: '8901030985223',
        location: 'Chennai Hub',
        date: '2026-09-08T09:15:00Z',
        extractedMrp: '150.00',
        extractedQty: '500 g',
        status: 'COMPLIANT'
    },
    {
        id: 'CASE-105',
        gtin: '8901030985223',
        location: 'Bangalore Hub',
        date: '2026-09-09T14:25:00Z',
        extractedMrp: '160.00',
        extractedQty: '500 g',
        status: 'REVIEW_REQUIRED'
    }
];

module.exports = {
    products,
    inspections
};
