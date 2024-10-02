import { useEffect, useState } from "react";

function App() {
  const [popularTags, setPopularTags] = useState([]);
  const [activeTag, setActiveTag] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchPopularTags();
  }, []);

  const fetchPopularTags = async () => {
    const url =
      "https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&site=stackoverflow";

    fetch(url)
      .then((response) => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        const tags = data.items.slice(0, 10);
        setPopularTags(tags);

        const activeTag = tags[0].name;
        setActiveTag(activeTag);
      })
      .catch((error) => {
        console.error("Error when fetching tags", error);
      });
  };

  useEffect(() => {
    fetchQuestionListing();
  }, [activeTag]);

  const fetchQuestionListing = async () => {
    const url = `https://api.stackexchange.com/2.3/questions?page=1&pagesize=20&order=desc&sort=activity&tagged=${activeTag}&site=stackoverflow`;

    fetch(url)
      .then((response) => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        const questions = data.items;
        setQuestions(questions);
      })
      .catch((error) => {
        console.error("Error when fetching tags", error);
      });
  };

  return (
    <div className="App">
      <section>
        <h2 className="text-2xl">Trending</h2>
        <div className="flex gap-2">
          {popularTags.map((tag) => (
            <div
              key={tag.name}
              className={`rounded-md border border-slate-300 py-0.5 px-2.5 text-center text-sm transition-all shadow-sm text-slate-600 ${
                activeTag === tag.name ? "bg-teal-400" : "bg-transparent"
              }`}
              onClick={() => setActiveTag(tag.name)}
            >
              {tag.name}
            </div>
          ))}
        </div>
      </section>
      <section>
        {questions.map((question) => (
          <section
            key={question.question_id}
            className="flex justify-between items-center border-b-2 border-gray-300"
          >
            <section className="block">
              <section>
                <h3>{question.title}</h3>
              </section>
              <section className="flex gap-2">
                <div className="text-center">
                  <span className="block text-red-500 text-sm">Score</span>
                  <span>{question.score}</span>
                </div>
                <div className="text-center">
                  <span className="block text-red-500 text-sm">Answers</span>
                  <span className="block text-white bg-green-500">
                    {question.answer_count}
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-red-500 text-sm">Viewed</span>
                  <span>{question.view_count}</span>
                </div>
              </section>
            </section>
            <section className="flex flex-col items-center">
              <img
                className="rounded-3xl"
                width="40px"
                height="40px"
                src={question.owner?.profile_image}
                alt="User avatar"
              />
              <span>{question.owner?.display_name}</span>
            </section>
          </section>
        ))}
      </section>
    </div>
  );
}

export default App;
