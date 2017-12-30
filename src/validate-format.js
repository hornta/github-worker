module.exports = (items) => {
  if(!Array.isArray(items)) {
    throw new Error('Bad format');
  }

  for(let i = 0; i < items.length; ++i) {
    if(typeof(items[i]) !== 'object') {
      throw new Error('Bad format');
    }

    if(typeof items[i].github !== 'string') {
      throw new Error('Bad format');
    }

    if(typeof items[i].process !== 'boolean') {
      throw new Error('Bad format');
    }

    if(typeof items[i].npm !== 'undefined' && typeof items[i].npm !== 'string') {
      throw new Error('Bad format');
    }
  }
}