import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Header = () => {
  const loginValue = sessionStorage.getItem("Login");
  const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };
  const navigation = [
    { name: "Home", href: "/", current: true },
    { name: "About", href: "/about", current: true },
    { name: "Domestic Package", href: "/domestic-package", current: true },
    { name: "International Package", href: "/international-package", current: true },
    // { name: "Testinomial", href: "/testimonial", current: true },
    { name: "Contact", href: "/contact", current: true },
  ];
  const userNavigation = [{ name: "Sign out", href: "#" }];
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-white shadow-md">
        {({ open, setOpen }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[#7B3226]">
                      <Link to="/">
                        MR AND MRS{" "}
                        <span className="text-[#C5733C]">PERFECT TRIPS</span>
                      </Link>
                    </h2>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? " text-black"
                            : "text-gray-300 hover:bg-[#C5733C] hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Link to={"/cart"}>
                            <i
                              style={{ fontSize: "24px", color: "#7B3226" }}
                              className="ri-shopping-cart-fill"
                            ></i>
                          </Link>
                          {
                            loginValue ? <Link
                              className="px-3 py-2 cursor-pointer text-white font-bold small-cap rounded-[10px] bg-[#7B3226]"
                              to={"/profile"}
                            >
                              Profile
                            </Link> :
                              <Link
                                className="px-3 py-2 cursor-pointer text-white font-bold small-cap rounded-[10px] bg-[#7B3226]"
                                to={"/register"}
                              >
                                Register
                              </Link>
                          }
                        </div>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-[#C5733C]  p-2 text-white hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  {/* Cart and Profile Links for Mobile */}
                  <Link to="/cart" className="mr-4" onClick={() => setOpen(false)}>
                    <i
                      style={{ fontSize: "24px", color: "#7B3226" }}
                      className="ri-shopping-cart-fill"
                    ></i>
                  </Link>
                  {loginValue ? (
                    <Link
                      className="px-3 py-2 cursor-pointer text-white font-bold small-cap rounded-[10px] bg-[#7B3226]"
                      to="/profile"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>
                  ) : (
                    <Link
                      className="px-3 py-2 cursor-pointer text-white font-bold small-cap rounded-[10px] bg-[#7B3226]"
                      to="/register"
                      onClick={() => setOpen(false)}
                    >
                      Register
                    </Link>
                  )}
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default Header;
