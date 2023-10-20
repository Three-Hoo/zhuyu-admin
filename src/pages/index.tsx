import { withSessionSsr } from "@/utils/session"

const Home = () => {
    return null
}

export const getServerSideProps = withSessionSsr(({ req }: any) => {
    const user = req.session.user
    if (user?.expires > Date.now()) {
      return {
        redirect: {
          destination: '/dashboard/user/user',
          permanent: false,
        },
      }
    }
    return { redirect: {
        destination: '/login',
        permanent: false,
      }, }
  })

export default Home
