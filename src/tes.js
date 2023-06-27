
const { nanoid } = require('nanoid');

const books = require('./books');













// get data secara spesifik

const handlerAddNoteapp = (request, h) => {

	const id = nanoid(16);

	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

	if (name === undefined) {

		const response = h.response({

			status: 'fail',

			message: 'Gagal menambahkan buku. Mohon isi nama buku'

		});

		response.code(400);

		return response;

	}

	if (pageCount < readPage) {

		const response = h.response({

			status: 'fail',

			message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'

		});

		response.code(400);

		return response;

	}

	const insertedAt = new Date().toISOString();

	const updatedAt = insertedAt;

	const finished = (pageCount == readPage);

	const Newbooks = {

		id,

		name,

		year,

		author,

		summary,

		publisher,

		pageCount,

		readPage,

		finished,

		reading,

		insertedAt,

		updatedAt

	};

	books.push(Newbooks);

	const isSucces = books.filter((book) => book.id === id).length > 0;

	if (isSucces) {

		const response = h.response({

			status: 'success',

			message: 'Buku berhasil ditambahkan',

			data: {

				bookId: id

			}

		});

		response.code(201);

		return response;

	}

	const response = h.response({

		status: 'fail',

		message: 'data tidak berhasil di tambahkan'

	});

	response.code(500);

	return response;

};



// menampilkan data 

const getbyAllbook = (request, h) => {

	const { name, reading, finished } = request.query;

	let filteredBooks = books;

	if (name !== undefined || reading !== undefined || finished !== undefined) {

		filteredBooks = filteredBooks.filter((book) => {

			if (reading !== undefined) {

				if (!(book.reading === Boolean(Number(reading)))) return false;

			}

			if (name !== undefined) {

				if (!book.name.toLowerCase().includes(name.toLowerCase()))

					return false;

			}

			if (finished !== undefined) {

				if (!(book.finished === Boolean(Number(finished)))) return false;

			}

			return true;

		});

	}

	const result = filteredBooks.map((b) => ({

		id: b.id,

		name: b.name,

		publisher: b.publisher,

	}));

	const response = h.response({

		status: 'success',

		data: {

			books: result

		}

	});

	response.code(200);

	return response;



};











// menampilkan detail dari books

const getBookByidhandler = (request, h) => {

	const { id } = request.params;

	const bookId = books.filter((b) => b.id === id)[0];

	if (bookId !== undefined) {

		return {

			status: 'success',

			data: {

				book: bookId,

			}

		};

	}

	const response = h.response({

		status: 'fail',

		message: 'Buku tidak ditemukan'

	});

	response.code(404);

	return response;

};





// edit books

const editbooksHandler = (request, h) => {

	const { id } = request.params;

	const {

		name,

		year,

		author,

		summary,

		publisher,

		pageCount,

		readPage,

		reading, } = request.payload;

	const updatedAt = new Date().toISOString();

	const index = books.findIndex((book) => book.id === id);

	if (index !== -1) {

		if (name === undefined) {

			const response = h.response({

				status: 'fail',

				message: 'Gagal memperbarui buku. Mohon isi nama buku'

			});

			response.code(400);

			return response;

		}

		if (pageCount < readPage) {

			const response = h.response({

				status: 'fail',

				message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'

			});

			response.code(400);

			return response;

		}

		const finished = (pageCount === readPage);

		books[index] = {

			...books[index],

			name,

			year,

			author,

			summary,

			publisher,

			pageCount,

			readPage,

			finished,

			reading,

			updatedAt,

		};

		const response = h.response({

			status: 'success',

			message: 'Buku berhasil diperbarui',

		});

		response.code(200);

		return response;

	}

	const response = h.response({

		status: 'fail',

		message: 'Gagal memperbarui buku. Id tidak ditemukan'

	});

	response.code(404);

	return response;

};

// hadler delete 

const handlerBydeleteBooks = (request, h) => {

	const { id } = request.params;

	const Index = books.findIndex((book) => book.id === id);

	if (Index !== -1) {

		books.splice(Index, 1);

		const response = h.response({

			status: 'success',

			message: 'Buku berhasil dihapus',

		});

		response.code(200);

		return response;

	}

	const response = h.response({

		status: 'fail',

		message: 'Buku gagal dihapus. Id tidak ditemukan'

	});

	response.code(404);

	return response;

};

