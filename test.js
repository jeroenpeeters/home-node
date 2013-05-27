var crypto = require('crypto')

var md5sum = crypto.createHash('md5');

md5sum.update('29d051d32')
console.log(md5sum.digest('hex'))

//<gip><version>1</version><email>jeroen@peetersweb.nl</email><password>fa0736d422d65f32c421809c23ad53c6</password></gip>

console.log(encodeURIComponent('cmd=GWRLogin&data=<gip><version>1</version><email>jeroen@peetersweb.nl</email><password>fa0736d422d65f32c421809c23ad53c6</password></gip>'))

<gip><version>1</version><token>918451e91137f8c657a32084a9eb540063588454</token>

UserThermostatSetData
<gip><version>1</version><token>918451e91137f8c657a32084a9eb540063588454</token><system>heating</system><fan>none</fan><tempsetheat>15.0</tempsetheat>