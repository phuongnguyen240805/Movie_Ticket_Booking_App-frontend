import { useUser, SignIn } from "@clerk/clerk-react";
import { useAppContext } from "@/context/AppContext";

import Loading from "@/components/Loading";
import { routesConfig } from "@/configs";

function ProtectedAdminRoute({ children }) {

    const { isAdmin } = useAppContext();
    const { isLoaded } = useUser();

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <SignIn fallbackRedirectUrl={routesConfig.admin} />
            </div>
        );
    } else {
        return isLoaded ? children : <Loading />;
    };
};

export default ProtectedAdminRoute;
