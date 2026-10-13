function Home() {
    return (
        <main>
            <h1>HOME</h1>

            <section>
                <h2>Benvenuto su ArenaHub</h2>
                <p>Trova un torneo, iscriviti e segui la classifica.</p>
            </section>

            <section>
                <h3>Prossimi tornei</h3>
                {/* Da sostituire con i tornei presi da GET /api/tornei */}
                <p>Nessun torneo aperto</p>
            </section>

            <a href="/tornei">Visualizza tornei</a>
        </main>
    );
}

export default Home;
