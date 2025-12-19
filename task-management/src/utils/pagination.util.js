export const getPagination = (page, limit, total) => {
    const currentPage = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const totalPages = Math.ceil(total / limitNum);

    return {
        total,
        page: currentPage,
        limit: limitNum,
        pages: totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
};
