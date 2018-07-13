const ENV =
    {
        DEV:
            {
                WebServiceURL: "http://localhost:3000/api/"
            },
        PROD:
            {
                WebServiceURL: "https://tiorem-webhose-api.herokuapp.com/api/"
            }
    };

const CurrentENV = ENV.DEV;