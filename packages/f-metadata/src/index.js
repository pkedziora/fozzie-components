const initialiseBraze = (options = {
    apiKey: null,
    userId: null,
    enableLogging: false,
    disableComponent: false,
    callbacks: {
        handleContentCards: null
    }
}) => {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];

        if (!options.disableComponent) {
            import(/* webpackChunkName: "appboy-web-sdk" */ 'appboy-web-sdk')
                .then(({ default: appboy }) => {
                    if (options.apiKey && options.apiKey.length && options.userId && options.userId.length) {
                        appboy.initialize(options.apiKey, { enableLogging: options.enableLogging });

                        appboy.display.automaticallyShowNewInAppMessages();

                        appboy.openSession();
                        window.appboy = appboy;

                        appboy.changeUser(options.userId, () => {
                            window.dataLayer.push({
                                event: 'appboyReady'
                            });
                        });

                        appboy.requestContentCardsRefresh();

                        appboy.subscribeToContentCardsUpdates(contentCards => {
                            if (contentCards
                                && contentCards.cards.length
                                && options.callbacks.handleContentCards) {
                                options.callbacks.handleContentCards(contentCards.cards);
                            }
                        });
                    }
                })
                .catch(error => `An error occurred while loading the component: ${error}`);
        }
    }
};

export default initialiseBraze;
