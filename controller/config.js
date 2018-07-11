const ENV =
    {
        DEV:
            {
                WebServiceURL: "http://localhost:3000/api/"
            },
        PROD:
            {
                WebServiceURL: "https://tioremapi.herokuapp.com/api/"
            }
    };

const CurrentENV = ENV.PROD;