# IBAN to BIC/SWIFT

Find a BIC/SWITFT code from an IBAN is not easy. Fortunately, some website does it for us. But you have to do it one iban at a time, so it's painfull.

The goal of this repository is to automate this. Given a list of ibans, the code scraps [ibancalculator.com/](https://www.ibancalculator.com/) to find the BIC/SWIFT.
Once finished it returns a **csv** file, where the first column is the IBAN, and the second column is the BIC/SWIFT.

## How to use

Create a `ìbans.json` file that contains an array of ibans.

To build the code
```sh
npm run build
```

Then, to run it
```sh
npm start
```
