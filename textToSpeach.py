import pyttsx3
engine = pyttsx3.init() 

""" RATE"""
rate = engine.getProperty('rate')   
print (rate)                        
engine.setProperty('rate', 125)     


"""VOLUME"""
volume = engine.getProperty('volume')   
print (volume)                          
engine.setProperty('volume',1.0)    

"""VOICE"""
voices = engine.getProperty('voices')       
#engine.setProperty('voice', voices[0].id)  
engine.setProperty('voice', voices[1].id)   

engine.say("taru naam su chhe?!")
engine.say('My current speaking rate is ' + str(rate))
engine.runAndWait()
engine.stop()

"""Saving Voice to a file"""
engine.save_to_file('Hello World', 'test.mp3')
engine.runAndWait()