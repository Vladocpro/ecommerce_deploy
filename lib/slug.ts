// "Nike Air", "Men", "Jacket" -> "nike-air-men-jacket"
export const slugify = (...parts: string[]) =>
    parts.join(" ")
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
