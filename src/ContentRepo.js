async function* getContent(
  url = `https://www.reddit.com/r/reactjs/.json?limit=2`
) {
  let nextUrl = null;

  while (true) {
    nextUrl = nextUrl || url;
    const json = await fetch(nextUrl).then(response => response.json());

    nextUrl = `${url}&after=${json.data.after}`;

    yield json.data.children.map(_ => _.data);
  }
}

export { getContent };
