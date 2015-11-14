function navTo (section) {
	location.href = '#' + section;
}

function getQuery(obj) {
	var queries = obj.val().split(',').filter(Boolean);
	return queries;
}