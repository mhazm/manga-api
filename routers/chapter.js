const router = require("express").Router();
const cheerio = require("cheerio");
const AxiosService = require("../helpers/axiosService");

router.get("/", (req, res) => {
  res.send({
    message: "chapter"
  });
});

//chapter ----done ----
router.get("/:slug", async (req, res) => {
  const slug = req.params.slug;
  try {
    //response
    const response = await AxiosService(`https://westmanga/manga/${slug}`);
    const $ = cheerio.load(response.data);
    const content = $("div.postarea");
    let chapter_image = [];
    const obj = {};
    obj.chapter_endpoint = slug + "/";

    const getTitlePages = content.find("div.entry-title")
    getTitlePages.filter(() => {
      obj.title = $(getTitlePages).find("h1").text();
    });
    // obj.download_link = link;

    const getPages = $('div.readerarea > img')
    obj.chapter_pages = getPages.length;
    getPages.each((i, el) => {
      chapter_image.push({
        chapter_image_link: $(el).attr("src").replace('i1.wp.com/',''),
        image_number: i + 1,
      });
    });
    obj.chapter_image = chapter_image;
    res.json(obj);
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error,
      chapter_image :[]
    });
  }
});

module.exports = router;