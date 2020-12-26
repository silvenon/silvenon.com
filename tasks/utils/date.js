const dateFns = require('date-fns')

function formatDateISO(date) {
  return dateFns.formatISO(date, {
    representation: 'date',
  })
}

module.exports = {
  formatDateISO,
}
