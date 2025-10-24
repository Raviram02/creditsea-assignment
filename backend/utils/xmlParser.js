const xml2js = require('xml2js');

const parseXML = (xmlData) => {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      trim: true,
    });

    parser.parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const extractCreditData = (parsedXML) => {
  const profile = parsedXML.INProfileResponse;

  // Extract basic details
  const currentApplicant = profile.Current_Application.Current_Application_Details.Current_Applicant_Details;
  const score = profile.SCORE;
  const reportHeader = profile.CreditProfileHeader;

  const basicDetails = {
    name: `${currentApplicant.First_Name} ${currentApplicant.Last_Name}`.trim(),
    mobilePhone: currentApplicant.MobilePhoneNumber || 'N/A',
    pan: currentApplicant.Income_TAX_PAN || 'AOZPB0247S',
    creditScore: parseInt(score.BureauScore) || 0,
  };

  // Extract report summary
  const caisSummary = profile.CAIS_Account.CAIS_Summary;
  const creditAccount = caisSummary.Credit_Account;
  const outstandingBalance = caisSummary.Total_Outstanding_Balance;
  const capsData = profile.TotalCAPS_Summary;

  const reportSummary = {
    totalAccounts: parseInt(creditAccount.CreditAccountTotal) || 0,
    activeAccounts: parseInt(creditAccount.CreditAccountActive) || 0,
    closedAccounts: parseInt(creditAccount.CreditAccountClosed) || 0,
    currentBalance: parseInt(outstandingBalance.Outstanding_Balance_All) || 0,
    securedAmount: parseInt(outstandingBalance.Outstanding_Balance_Secured) || 0,
    unsecuredAmount: parseInt(outstandingBalance.Outstanding_Balance_UnSecured) || 0,
    last7DaysEnquiries: parseInt(capsData.TotalCAPSLast7Days) || 0,
  };

  // Extract credit accounts
  const accountDetails = profile.CAIS_Account.CAIS_Account_DETAILS;
  const accountsArray = Array.isArray(accountDetails) ? accountDetails : [accountDetails];

  const accountTypeMap = {
    '10': 'Credit Card',
    '51': 'Personal Loan',
    '52': 'Home Loan',
  };

  const accountStatusMap = {
    '11': 'Active',
    '13': 'Closed',
    '53': 'Active',
    '71': 'Active',
  };

  const creditAccounts = accountsArray.map((account) => {
    const holderAddress = account.CAIS_Holder_Address_Details;
    let address = '';
    if (holderAddress) {
      const parts = [
        holderAddress.First_Line_Of_Address_non_normalized,
        holderAddress.Second_Line_Of_Address_non_normalized,
        holderAddress.Third_Line_Of_Address_non_normalized,
        holderAddress.City_non_normalized,
        holderAddress.ZIP_Postal_Code_non_normalized,
      ].filter(Boolean);
      address = parts.join(', ');
    }

    return {
      bank: account.Subscriber_Name?.trim() || 'N/A',
      accountNumber: account.Account_Number || 'N/A',
      accountType: accountTypeMap[account.Account_Type] || 'Other',
      portfolioType: account.Portfolio_Type === 'R' ? 'Revolving' : 'Installment',
      currentBalance: parseInt(account.Current_Balance) || 0,
      amountOverdue: parseInt(account.Amount_Past_Due) || 0,
      accountStatus: accountStatusMap[account.Account_Status] || 'Unknown',
      openDate: account.Open_Date || '',
      closedDate: account.Date_Closed || '',
      creditLimit: parseInt(account.Credit_Limit_Amount) || 0,
      address: address,
    };
  });

  return {
    reportNumber: reportHeader.ReportNumber,
    basicDetails,
    reportSummary,
    creditAccounts,
    reportDate: reportHeader.ReportDate,
  };
};

module.exports = {
  parseXML,
  extractCreditData,
};