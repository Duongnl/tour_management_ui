export const CreateSlug = (slug:string) => {
    var slugify = require('slugify')
    slugify.extend({'Đ': 'D'})
    slugify.extend({'đ': 'd'})
    slugify('some string', {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: false,      // convert to lower case, defaults to `false`
        strict:false,     // strip special characters except replacement, defaults to `false`
        locale: 'vi',      // language code of the locale to use
        trim: true,         // trim leading and trailing replacement chars, defaults to `true`
      })
      return slugify(slug)
}

