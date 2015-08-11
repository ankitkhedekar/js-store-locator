
function FoodtruckDS(callback) {
  that = this;
  $.get('data.csv', function(data) {
  	that.stores = that.parse_(data);
    callback();
  });
}

FoodtruckDS.prototype.getStores = function(){
  return this.stores;
}

FoodtruckDS.prototype.parse_ = function(csv) {
  var stores = [];
  var rows = csv.split('\n');
  var headings = this.parseRow_(rows[0]);

  for (var i = 1, row; row = rows[i]; i++) {
    row = this.toObject_(headings, this.parseRow_(row));
    //console.log(row.Status);

    if(row.Status == 'APPROVED'){
	    stores.push(row);
    }
    
  }

  return stores;
};

FoodtruckDS.prototype.parseRow_ = function(row) {

  row = row.split(',');

  return row;
};

FoodtruckDS.prototype.toObject_ = function(headings, row) {
  var result = {};
  for (var i = 0; i < row.length;i++) {
  	//console.log(headings[i]+" ::::::: "+row[i]);
    result[headings[i]] = row[i];
  }
  return result;
};