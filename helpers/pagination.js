const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? (page - 1) * limit : 0;

    return { limit, offset };
};

const getPagingData = (datas, page, limit, branch=null) => {
    const { count: total_items, rows: data } = datas;
    const current_page = page ? +page : 1;
    const total_page = Math.ceil(total_items / limit);
    const total_item_page = limit;

    if (branch != null) {
        return { data,branch, total_items, total_item_page, current_page, total_page };
    }

    return { data, total_items, total_item_page, current_page, total_page };
};

module.exports = { getPagination, getPagingData }