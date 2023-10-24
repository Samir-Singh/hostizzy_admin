import * as CryptoJS from 'crypto-js';
import moment from 'moment';
export const generatePassword = () => {
  let pass = '';
  let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz0123456789@#$';

  for (let i = 1; i <= 8; i++) {
    let char = Math.floor(Math.random()
      * str.length + 1);

    pass += str.charAt(char)
  }

  return pass;
}


export const encryptAES = (text) => {
  return CryptoJS.AES.encrypt(text, 'aes-256-cbc').toString();
}

export const decryptAES = (encryptedBase64) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, 'aes-256-cbc');
  if (decrypted) {
    try {
      const str = decrypted.toString(CryptoJS.enc.Utf8);
      if (str.length > 0) {
        return str;
      } else {
        return encryptedBase64;
      }
    } catch (e) {
      return encryptedBase64;
    }
  }
  return encryptedBase64;
}

export const exportProperty = (data) => {
  const CSVrows = [];
  CSVrows.push(["Creation Time", 'Property Name', 'Property Price', "Property Location", "Property Rooms "])
  data.forEach(it => {
    const row = []
    let changedDate = moment(it?.created_at).format('ddd MMMM Do YYYY, h:mm:ss a');
    row.push(changedDate)
    row.push(it.name)
    row.push(it.price)
    row.push(`${it?.location?.address} ${it?.location?.city} ${it?.location?.state} ${it?.location?.country} ${it?.location?.zip}`)
    row.push(it.rooms)
    CSVrows.push(row)
  })

  function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var line = '';
    // header
    var head = array[0];


    for (var index in head) {
      var value = head[index] + "";
      line += '"' + value.replace(/"/g, '""') + '"' + ',';
    }
    line = line.slice(0, -1);
    str += line + '\r\n';

    // data
    for (var i = 1; i < array.length; i++) {
      for (let index in array[i]) {
        let value = array[i][index] + "";
        line += '"' + value.replace(/"/g, '""') + '"' + ',';
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }

  let CSV = JSON2CSV(CSVrows)

  var a = document.createElement("a");
  a.style = "display: none";
  var blob = new Blob([CSV], { type: 'text/csv;charset=UTF-8;' });
  var blobUrl = URL.createObjectURL(blob);
  a.href = blobUrl;

  let reportName = "report.csv";
  reportName = `property_${new Date().toLocaleString()}.csv`

  a.download = reportName;
  document.body.appendChild(a);
  a.click();
}

export const exportBookingList = (data) => {
  const CSVrows = [];
  CSVrows.push(["Name", 'Email', 'Phone Number', "Property Name"])
  data.forEach(it => {
    const row = []
    row.push(it?.name)
    row.push(it.email)
    row.push(it.phone_number)
    row.push(`${it?.property_details ? it?.property_details?.name : "Not available"}`)
    CSVrows.push(row)
  })

  function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var line = '';
    // header
    var head = array[0];


    for (var index in head) {
      var value = head[index] + "";
      line += '"' + value.replace(/"/g, '""') + '"' + ',';
    }
    line = line.slice(0, -1);
    str += line + '\r\n';

    // data
    for (var i = 1; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        let value = array[i][index] + "";
        line += '"' + value.replace(/"/g, '""') + '"' + ',';
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }

  let CSV = JSON2CSV(CSVrows)

  var a = document.createElement("a");
  a.style = "display: none";
  var blob = new Blob([CSV], { type: 'text/csv;charset=UTF-8;' });
  var blobUrl = URL.createObjectURL(blob);
  a.href = blobUrl;

  let reportName = "report.csv";
  reportName = `property_${new Date().toLocaleString()}.csv`

  a.download = reportName;
  document.body.appendChild(a);
  a.click();
}
export const exportLeadsList = (data) => {
  const CSVrows = [];
  CSVrows.push(["Name", 'Email', 'Phone Number', "Property Type" ,"Required Service"])
  data.forEach(it => {
    const row = []
    row.push(it?.name)
    row.push(it.email)
    row.push(it.phone_number)
    row.push(`${it?.property_type ? it?.property_type: "Not available"}`)
    row.push(it?.services_required)
    CSVrows.push(row)
  })

  function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var line = '';
    // header
    var head = array[0];


    for (var index in head) {
      var value = head[index] + "";
      line += '"' + value.replace(/"/g, '""') + '"' + ',';
    }
    line = line.slice(0, -1);
    str += line + '\r\n';

    // data
    for (var i = 1; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        let value = array[i][index] + "";
        line += '"' + value.replace(/"/g, '""') + '"' + ',';
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }

  let CSV = JSON2CSV(CSVrows)

  var a = document.createElement("a");
  a.style = "display: none";
  var blob = new Blob([CSV], { type: 'text/csv;charset=UTF-8;' });
  var blobUrl = URL.createObjectURL(blob);
  a.href = blobUrl;

  let reportName = "report.csv";
  reportName = `property_${new Date().toLocaleString()}.csv`

  a.download = reportName;
  document.body.appendChild(a);
  a.click();
}

export const exportEnquiriesList = (data) => {
  const CSVrows = [];
  CSVrows.push(["Name", 'Email', 'Phone Number', "Property Type" ,"Comment"])
  data.forEach(it => {
    const row = []
    row.push(it?.name)
    row.push(it.email)
    row.push(it.phone_number)
    row.push(`${it?.property_type ? it?.property_type: "Not available"}`)
    row.push(it?.comments)
    CSVrows.push(row)
  })

  function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var line = '';
    // header
    var head = array[0];


    for (var index in head) {
      var value = head[index] + "";
      line += '"' + value.replace(/"/g, '""') + '"' + ',';
    }
    line = line.slice(0, -1);
    str += line + '\r\n';

    // data
    for (var i = 1; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        let value = array[i][index] + "";
        line += '"' + value.replace(/"/g, '""') + '"' + ',';
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }

  let CSV = JSON2CSV(CSVrows)

  var a = document.createElement("a");
  a.style = "display: none";
  var blob = new Blob([CSV], { type: 'text/csv;charset=UTF-8;' });
  var blobUrl = URL.createObjectURL(blob);
  a.href = blobUrl;

  let reportName = "report.csv";
  reportName = `property_${new Date().toLocaleString()}.csv`

  a.download = reportName;
  document.body.appendChild(a);
  a.click();
}
export const exportNewsLetterList = (data) => {
  const CSVrows = [];
  CSVrows.push(["Creation Time", 'Email'])
  data.forEach(it => {
    const row = []
    let changedDate = moment(it?.created_at).format('ddd MMMM Do YYYY, h:mm:ss a');
    row.push(changedDate)
    row.push(it.email)
    CSVrows.push(row)
  })

  function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var line = '';
    // header
    var head = array[0];


    for (var index in head) {
      var value = head[index] + "";
      line += '"' + value.replace(/"/g, '""') + '"' + ',';
    }
    line = line.slice(0, -1);
    str += line + '\r\n';

    // data
    for (var i = 1; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        let value = array[i][index] + "";
        line += '"' + value.replace(/"/g, '""') + '"' + ',';
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }

  let CSV = JSON2CSV(CSVrows)

  var a = document.createElement("a");
  a.style = "display: none";
  var blob = new Blob([CSV], { type: 'text/csv;charset=UTF-8;' });
  var blobUrl = URL.createObjectURL(blob);
  a.href = blobUrl;

  let reportName = "report.csv";
  reportName = `property_${new Date().toLocaleString()}.csv`

  a.download = reportName;
  document.body.appendChild(a);
  a.click();
}