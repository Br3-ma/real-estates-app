const myHeaders = new Headers();
myHeaders.append("Content-Digest", "tempor");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjkzNSIsImV4cCI6MjA0NDc5MzI2NiwiaWF0IjoxNzI5MjYwNDY2LCJwbSI6IkRBRixQQUYiLCJqdGkiOiIzOTU5NmMyOS02MWJlLTQ2MjMtOTczZS1lMGE3Yzg3MzE0NDgifQ.mhcRvNtSGalGqzWqeqzFopLf1D1kmVxOjWyCb_7jCibrCMlPDbK5HunE7BbtKOYnGSsB_66ovRFsTV8b93xoqg");
// myHeaders.append("Cookie", "JSESSIONID=B6AFAEEFCFEC902087A36792B875E776");

const raw = JSON.stringify({
  "depositId": "2e492454-2f83-4b3a-8873-f24358419a10",
  "amount": "15",
  "currency": "ZMW",
  "correspondent": "MTN_MOMO_ZMB",
  "payer": {
    "address": {
      "value": "260768715277"
    },
    "type": "MSISDN"
  },
  "customerTimestamp": "2024-10-18T16:22:28Z",
  "statementDescription": "Note of 4 to 22 chars",
  "country": "ZMB",
  "preAuthorisationCode": "PMxQYqfDx",
  "metadata": [
    {
      "fieldName": "orderId",
      "fieldValue": "ORD-123456789"
    },
    {
      "fieldName": "customerId",
      "fieldValue": "nyeleti.bremah@gmail.com",
      "isPII": true
    }
  ]
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.pawapay.io/deposits", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));