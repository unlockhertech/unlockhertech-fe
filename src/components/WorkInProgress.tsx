export function WorkInProgress(): JSX.Element {
  return (
    <>
      <div
        style={{
          paddingTop: "30px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <img
          style={{ borderRadius: "50px" }}
          alt="Lady saying 'we working on it'"
          src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHlycDNteTZ1eWl2engxa2FvaTl6dWJrZHc2NGhnejNwY2U3OGs4NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WUjCiMJUPXSnnWb4j0/giphy.gif"
        ></img>
      </div>
      <div>
        <h5
          style={{
            paddingTop: "30px",
            textAlign: "center",
          }}
        >
          The UnlockHerTech team is working on something new.
          <br /> Follow our social media links to stay tuned!
        </h5>
      </div>
      <div className="social-media-links">
        <a
          href="https://uk.linkedin.com/company/unlockhertech"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link linkedin"
        >
          LinkedIn
        </a>
        <a
          href="https://www.instagram.com/unlockhertech/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link instagram"
        >
          Instagram
        </a>
      </div>
    </>
  );
}
