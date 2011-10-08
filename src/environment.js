(window.widget || {}).environment = {
	/**
	 * vehicle can be 'TRAIN', '
	 * distance is in kilometers
	 * returns grams of CO2 (fossil)
	 * data from Victoriainstitutet: http://www.trafiklab.se/api/emissionquantity
	 */
	calculateEmission: function(vehicle,distance){
		return {tram:0.00084,train:0.00230,bus:75.80000,carmetan:76.00000,caretanol:91.00000,cardiesel:164.60000,carpetrol:194.00000}[vehicle]*distance;
	}
};
