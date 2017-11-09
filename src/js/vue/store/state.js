export default {
    key: null,
    storageName: null,
    menu: [
        { name: 'menu.result', route: { name: 'page.result' } },
        { divider: true },
        { name: 'menu.income', route: { name: 'page.income' } },
        { name: 'menu.loan', route: { name: 'page.loan' } },
        { name: 'menu.saving', route: { name: 'page.saving' } },
        { name: 'menu.expense', route: { name: 'page.expense' } },
        { divider: true },
        { name: 'menu.settings', route: { name: 'page.settings' } },
    ],
    view: 'budget',
    selectedPeriod: 201701,
    languages: ['sv'],
    defaultLanguage: 'sv',
    currentLanguage: null
}