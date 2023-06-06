import * as React from "react";
import Image from "next/image";

type fakeChatMessageProps = {};

const FakeChatMessage: React.FC<fakeChatMessageProps> = (props) => {
  return (
    <>
      <div className="chat-message">
        <div className="flex items-end">
          <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
            <div>
              <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
                Can be verified on any platform using docker
              </span>
            </div>
          </div>
          <Image
            width={0}
            height={0}
            src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
            alt="My profile"
            className="order-1 h-6 w-6 rounded-full"
          />
        </div>
      </div>
      <div className="chat-message">
        <div className="flex items-end justify-end">
          <div className="order-1 mx-2 flex max-w-xs flex-col items-end space-y-2 text-xs">
            <div>
              <span className="inline-block rounded-lg rounded-br-none bg-blue-600 px-4 py-2 text-white ">
                Your error message says permission denied, npm global installs
                must be given root privileges.
              </span>
            </div>
          </div>
          <Image
            width={0}
            height={0}
            src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
            alt="My profile"
            className="order-2 h-6 w-6 rounded-full"
          />
        </div>
      </div>
      <div className="chat-message">
        <div className="flex items-end">
          <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
            <div>
              <span className="inline-block rounded-lg bg-gray-300 px-4 py-2 text-gray-600">
                Command was run with root privileges. I'm sure about that.
              </span>
            </div>
            <div>
              <span className="inline-block rounded-lg bg-gray-300 px-4 py-2 text-gray-600">
                I've update the description so it's more obviously now
              </span>
            </div>
            <div>
              <span className="inline-block rounded-lg bg-gray-300 px-4 py-2 text-gray-600">
                FYI https://askubuntu.com/a/700266/510172
              </span>
            </div>
            <div>
              <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
                Check the line above (it ends with a # so, I'm running it as
                root )<pre># npm install -g @vue/devtools</pre>
              </span>
            </div>
          </div>
          <Image
            width={0}
            height={0}
            src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
            alt="My profile"
            className="order-1 h-6 w-6 rounded-full"
          />
        </div>
      </div>
      <div className="chat-message">
        <div className="flex items-end justify-end">
          <div className="order-1 mx-2 flex max-w-xs flex-col items-end space-y-2 text-xs">
            <div>
              <span className="inline-block rounded-lg rounded-br-none bg-blue-600 px-4 py-2 text-white ">
                Any updates on this issue? I'm getting the same error when
                trying to install devtools. Thanks
              </span>
            </div>
          </div>
          <Image
            width={0}
            height={0}
            src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
            alt="My profile"
            className="order-2 h-6 w-6 rounded-full"
          />
        </div>
      </div>
      <div className="chat-message">
        <div className="flex items-end">
          <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
            <div>
              <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
                Thanks for your message David. I thought I'm alone with this
                issue. Please, ? the issue to support it :)
              </span>
            </div>
          </div>
          <Image
            width={0}
            height={0}
            src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
            alt="My profile"
            className="order-1 h-6 w-6 rounded-full"
          />
        </div>
      </div>
      <div className="chat-message">
        <div className="flex items-end justify-end">
          <div className="order-1 mx-2 flex max-w-xs flex-col items-end space-y-2 text-xs">
            <div>
              <span className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white ">
                Are you using sudo?
              </span>
            </div>
            <div>
              <span className="inline-block rounded-lg rounded-br-none bg-blue-600 px-4 py-2 text-white ">
                Run this command sudo chown -R `whoami` /Users/.npm-global/ then
                install the package globally without using sudo
              </span>
            </div>
          </div>
          <Image
            width={0}
            height={0}
            src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
            alt="My profile"
            className="order-2 h-6 w-6 rounded-full"
          />
        </div>
      </div>
      <div className="chat-message">
        <div className="flex items-end">
          <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
            <div>
              <span className="inline-block rounded-lg bg-gray-300 px-4 py-2 text-gray-600">
                It seems like you are from Mac OS world. There is no /Users/
                folder on linux ?
              </span>
            </div>
            <div>
              <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
                I have no issue with any other packages installed with root
                permission globally.
              </span>
            </div>
          </div>
          <Image
            width={0}
            height={0}
            src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
            alt="My profile"
            className="order-1 h-6 w-6 rounded-full"
          />
        </div>
      </div>
      <div className="chat-message">
        <div className="flex items-end justify-end">
          <div className="order-1 mx-2 flex max-w-xs flex-col items-end space-y-2 text-xs">
            <div>
              <span className="inline-block rounded-lg rounded-br-none bg-blue-600 px-4 py-2 text-white ">
                yes, I have a mac. I never had issues with root permission as
                well, but this helped me to solve the problem
              </span>
            </div>
          </div>
          <Image
            width={0}
            height={0}
            src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
            alt="My profile"
            className="order-2 h-6 w-6 rounded-full"
          />
        </div>
      </div>
      <div className="chat-message">
        <div className="flex items-end">
          <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
            <div>
              <span className="inline-block rounded-lg bg-gray-300 px-4 py-2 text-gray-600">
                I get the same error on Arch Linux (also with sudo)
              </span>
            </div>
            <div>
              <span className="inline-block rounded-lg bg-gray-300 px-4 py-2 text-gray-600">
                I also have this issue, Here is what I was doing until now:
                #1076
              </span>
            </div>
            <div>
              <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
                even i am facing
              </span>
            </div>
          </div>
          <Image
            width={0}
            height={0}
            src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
            alt="My profile"
            className="order-1 h-6 w-6 rounded-full"
          />
        </div>
      </div>
    </>
  );
};

export default FakeChatMessage;
