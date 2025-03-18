# Setting Up Vercel Environment Variables

To get your analytics dashboard to display real data instead of mock data, you need to properly configure the environment variables in your Vercel project.

## Steps to Set Up Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `redbaron-analytics` project
3. Click on the "Settings" tab
4. In the left sidebar, click on "Environment Variables"
5. Add the following variables:

### Required Environment Variables

| Name | Value | Description |
|------|-------|-------------|
| `GA_PROPERTY_ID` | `359617146` | Your Google Analytics property ID |
| `GA_CLIENT_EMAIL` | `analytics-data-service@analytics-452605.iam.gserviceaccount.com` | Your service account email |
| `GA_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQDRYQyd2R9nAZiD\nEUsQFtIuCGjVAQ1dBl6qlCKa3UWYCQqoGHi0hKGe28q0MVRs1V7PS5C80rTAUCAu\nZMMXlD06xAMh/3gX9p6AQS1aMChaxqiNZptpQJxVB//XrZglbb/f2Jp33mIFJkAS\nFHwlerjuaRMSruX+kVgJfj2hWyELItwYR61vW7+XfoKojWxkl09oRRILDxzJdoGR\nyfKr4pNsfEQjDUGMDY2FxAX1E0MlbkgAdGcRyjfJxWLVJU47/04ChsJ0Q1scdjq3\nOaOUP9+1e+/ItsExowEqkUvkQ5WmDWuMn9CbPpFp55nPiFko4d8R6tEvj8SkXGl+\nATH3hoSlAgMBAAECggEACdgd+QpW0brlxuL+wpX+fsySOGv3ivqilv/zZ12YIo+D\nEUEvsUKuu9XXDRIB4Q+tImKJ2EVKqBbiututv1BbpDiU2LndFYW/Kp+MRTop0FuY\nj1r8jpfLlRHhtp9b6mwwQiy6COdYEdu11aousuJqV62k1TmLT1gNEBeZe5pZwavl\noTMkgaDNylpeAFd2qld5QAOr/GLesEuxRYCsFf+OgZ3kjz043t7l0rTGDyw5DcD2\nHFbNQ71/4iU14OWRistIXqobC6OJKCQ9/sVn5jmJa3YhkoYv+4EDHQ26haY5ii5u\nPU90yVR/xabciuKKR/JMfz4F0GCtcx4ru+uP6awSMQKBgQDvMCCWOYwsSHHx6RtY\nbcaQEUTSXH8umG5LzghDgBW84MXWFu2rS646+WXVrKDJbBwv2fw97iKWkegfxMG3\nvjHGi8+Q7hCXDqNTO2SMpyOpxBHXR13vytssorUzXRBQ4ZTKqh8nuIiHfFz4DvIm\nBgv+I0qLlRvEEwZD9DFIYMCb6QKBgQDgGIzXKBOZ7Pl6HZjLJHlUVNsLcYrU0Boi\nLKTMM8whqYffb0y3VdGCuAT2K/W794w2iINgXlrm2GmAiSC+zCneibGLBkl/VKJy\npyjSZdVYtoFUtcZgnl7/AUWi/F3dlnAiwT7K7wRG2PnanBC9bUdIHcga3bNEScBj\nKS4VPL85XQJ/T2qrZzW0VP+41ZmQesv4Id2Z/D65+76g4IqIM+FTVmNLTMpQH5AB\nSZOFPG0U9cvvj/PQzL9EvLm1WNb7ewargEDrqjNhTsaNdBVETW8xaCyxv8jyZ6vz\nGd7sSyGbST+dJ61UqtuaeWHRfIt52yYm1TrihXX8wh2O9wEdW+rECQKBgCcooxPF\n0QcIvd905Io66WivG0e4o4Xkh2yJWJLGSllngnKsxD8VI/MvrM5HiD08WKf+2tYw\nJrpH/seTLsGoc3iLnxaoFpfFdk2KoDuDx/AklBz1VqDzi64LzttYNh7OdvHbytkz\nQxAOQjrNIq+3NMmJSrpHG1hHevLY81CKuO+RAoGABAJNZykxz617T1beJ68O1Ips\n+dz7tf3XGhCR1VJa09UPirR/EbvACl+PDZ5Ai0Aa67QMib3K2FgpNO7FU7rJoams\nTN+4uJzEj23LbosGhO38q5y3vvEcTb1FtjI6DcFisjDtyfXhibVebOretUwyHgHQ\nLXdvbj2txWDr65ouQ2s=\n-----END PRIVATE KEY-----\n` | Your private key with newlines as `\n` |

### Important Notes

1. **Do NOT add the `VITE_` prefix** to these variables in Vercel. The serverless API functions need the variables without the prefix.

2. **Private Key Format**: Make sure the private key has `\n` for newlines, not actual line breaks. The format should look exactly like the example above.

3. **Environment Target**: Set the environment to "Production" or choose "All" to apply to all environments.

## After Setting Environment Variables

1. After saving the environment variables, go to the "Deployments" tab
2. Find your latest deployment and click on the "..." menu
3. Select "Redeploy" to deploy with the new environment variables
4. Wait for the deployment to complete
5. Visit your website at [https://redbaron-analytics.vercel.app/](https://redbaron-analytics.vercel.app/) to see if it's now showing real data

## Checking Logs

If you're still seeing mock data, check the function logs:

1. Go to the "Deployments" tab
2. Click on your latest deployment
3. Click on "Functions" at the top
4. Find the function that's reporting an issue (like `/api/summary-metrics`)
5. Look at the logs to see what's happening

The debug logs we've added will show whether the environment variables are being found and if there are any errors connecting to the Google Analytics API. 