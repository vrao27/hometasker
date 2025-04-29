//static page describing the game - not a protected route

const About = () => (
  <main className="container py-4">
    {/* App Overview */}
    <section className="mb-4">
      <h1>About HomeTasker</h1>
      <p>
        HomeTasker turns everyday chores into a fun, points-based game.
        Assign yourself (or your housemates) point values for each task,
        complete them, and watch your score climb on the live leaderboard!
      </p>
    </section>

    {/* Key Features */}
    <section className="mb-4">
      <h2>Key Features</h2>
      <ul>
        <li>Create, complete, and delete household tasks</li>
        <li>Earn points and compete on the live leaderboard</li>
        <li>Simple point assignment makes chores rewarding</li>
        <li>Responsive design—works on desktop and mobile</li>
      </ul>
    </section>

    {/* How It Works */}
    <section>
      <h2>How It Works</h2>
      <ol>
        <li>Sign up or log in to your HomeTasker account.</li>
        <li>Add tasks with point values—whoever completes more wins!</li>
        <li>Complete your chores and watch your points—and bragging rights—grow.</li>
      </ol>
    </section>
  </main>
);

export default About;