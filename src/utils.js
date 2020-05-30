exports.propSort = (accessor) => {
	return (a, b) => {
		const x = accessor(a);
		const y = accessor(b);
		if (x < y) return -1;
		if (x > y) return 1;
		return 0;
	};
};
