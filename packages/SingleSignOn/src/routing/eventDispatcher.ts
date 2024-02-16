const eventDispatcher = (type: string) => {

    let events: any = {
        'login': '/collect/dashboard',
        'logout': '/authentication/login'
    }

    window.dispatchEvent(new CustomEvent('SingleSignOn', { detail: { type, url: events[type] } }))

}

export { eventDispatcher }