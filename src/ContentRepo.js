async function* getContent(
  url = `https://www.reddit.com/r/reactjs/.json?limit=4`
) {
  let after = null;
  let nextUrl = null;

  while (true) {
    nextUrl = nextUrl || url;
    const json = await fetch(nextUrl).then(response => response.json());

    after = json.data.after;
    nextUrl = `${nextUrl}&after=${after}`;

    yield json.data.children.map(_ => _.data);
  }
}

export { getContent };
