export default function Home() {
  return (
    <div className="container">
      <main className="hero">
        <div className="eyebrow">paste → summarize → export</div>
        <h1>
          YouTube 영상을
          <br />
          마크다운 요약으로
        </h1>
        <p>
          링크 하나만 붙여넣으면 핵심 포인트, 타임스탬프, 구조화된 노트를 담은
          깔끔한 마크다운 요약을 받아보세요.
        </p>
        <div className="url-demo">
          <span>https://www.youtube.com/watch?v=dQw4w9WgXcQ</span>
          <button className="btn btn-primary" disabled>
            요약하기
          </button>
        </div>
        <div className="hero-actions">
          <a href="/summarize" className="btn btn-primary">
            시작하기
          </a>
          <a href="/summaries" className="btn btn-ghost">
            저장된 요약 보기
          </a>
        </div>
      </main>

      <section className="steps">
        <h2>이렇게 작동해요</h2>
        <p className="lead">세 단계면 충분합니다</p>
        <div className="step-grid">
          <div className="card step-card">
            <div className="step-num">1</div>
            <h3>링크 붙여넣기</h3>
            <p>요약하고 싶은 YouTube 영상 URL을 입력창에 붙여넣으세요.</p>
          </div>
          <div className="card step-card">
            <div className="step-num">2</div>
            <h3>AI가 요약</h3>
            <p>Gemini가 영상 내용을 분석해 핵심 포인트와 구조를 정리합니다.</p>
          </div>
          <div className="card step-card">
            <div className="step-num">3</div>
            <h3>마크다운으로 저장</h3>
            <p>결과를 저장하고 노트 앱이나 문서에 바로 붙여넣으세요.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
